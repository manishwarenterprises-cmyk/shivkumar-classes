import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Lock, PlayCircle, Loader2, ArrowLeft } from "lucide-react";
import { Section } from "@/components/primitives";
import { Progress } from "@/components/ui/progress";
import {
  getCourseDetail,
  getLectureVideoUrl,
  saveProgress,
  enrollInCourse,
  type LectureRow,
} from "@/lib/courses.functions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/learn/$slug")({
  head: ({ params }) => ({ meta: [{ title: `Learn · ${params.slug}` }] }),
  component: LearnDetail,
});

function LearnDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const fetchDetail = useServerFn(getCourseDetail);
  const getUrl = useServerFn(getLectureVideoUrl);
  const persist = useServerFn(saveProgress);
  const enroll = useServerFn(enrollInCourse);

  const detail = useQuery({
    queryKey: ["course-detail", slug],
    queryFn: () => fetchDetail({ data: { slug } }),
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const lectures = detail.data?.lectures ?? [];
  const enrolled = !!detail.data?.enrolled;
  const progressMap = useMemo(() => {
    const m = new Map<string, { watched: number; completed: boolean }>();
    (detail.data?.progress ?? []).forEach((p) =>
      m.set(p.lecture_id, { watched: p.watched_seconds, completed: p.completed }),
    );
    return m;
  }, [detail.data]);

  const completedCount = (detail.data?.progress ?? []).filter((p) => p.completed).length;
  const pct = lectures.length ? Math.round((completedCount / lectures.length) * 100) : 0;

  useEffect(() => {
    if (lectures.length && !activeId) setActiveId(lectures[0].id);
  }, [lectures, activeId]);

  const canPlay = (lec: LectureRow) => lec.is_free || enrolled;

  const playLecture = async (lec: LectureRow) => {
    setActiveId(lec.id);
    setVideoUrl(null);
    if (!canPlay(lec)) return;
    if (!lec.video_path) {
      toast.error("Video not uploaded yet");
      return;
    }
    try {
      const { url } = await getUrl({ data: { lectureId: lec.id } });
      setVideoUrl(url);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const onTimeUpdate = async () => {
    const v = videoRef.current;
    const lec = lectures.find((l) => l.id === activeId);
    if (!v || !lec || !detail.data) return;
    const watched = Math.floor(v.currentTime);
    const completed = v.duration > 0 && v.currentTime / v.duration >= 0.9;
    if (watched % 10 !== 0 && !completed) return;
    try {
      await persist({
        data: {
          lectureId: lec.id,
          courseId: detail.data.course.id,
          watchedSeconds: watched,
          completed,
        },
      });
      if (completed) detail.refetch();
    } catch {}
  };

  const onEnroll = async () => {
    if (!detail.data) return;
    await enroll({ data: { courseId: detail.data.course.id } });
    toast.success("Enrolled!");
    detail.refetch();
  };

  if (detail.isLoading) {
    return <Section className="min-h-[60vh] grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-luxury" /></Section>;
  }
  if (!detail.data) {
    return <Section className="min-h-[60vh] grid place-items-center text-center">
      <div>
        <h1 className="font-display text-3xl">Course not found</h1>
        <button onClick={() => navigate({ to: "/learn" })} className="mt-4 text-luxury underline">Back to My Learning</button>
      </div>
    </Section>;
  }

  const { course } = detail.data;
  const activeLec = lectures.find((l) => l.id === activeId);

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="pt-10">
        <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> My Learning
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">{course.tag}</div>
            <h1 className="mt-2 font-display text-3xl md:text-5xl font-bold">{course.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{course.summary}</p>
          </div>
          {!enrolled && (
            <button onClick={onEnroll} className="rounded-2xl gradient-luxe text-white px-6 py-3 text-sm font-bold shadow-luxe">
              Enroll {course.price_inr > 0 ? `· ₹${course.price_inr}` : "Free"}
            </button>
          )}
        </div>
        {enrolled && lectures.length > 0 && (
          <div className="mt-6 max-w-md">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Course progress</span><span>{completedCount}/{lectures.length} · {pct}%</span>
            </div>
            <Progress value={pct} />
          </div>
        )}
      </Section>

      <Section className="!pt-0">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="rounded-3xl bg-black ring-1 ring-border overflow-hidden aspect-video relative">
            {activeLec && canPlay(activeLec) && videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full h-full"
                onTimeUpdate={onTimeUpdate}
                onEnded={onTimeUpdate}
              />
            ) : activeLec && !canPlay(activeLec) ? (
              <div className="absolute inset-0 grid place-items-center text-white/80">
                <div className="text-center">
                  <Lock className="h-10 w-10 mx-auto text-luxury" />
                  <p className="mt-3">Enroll to unlock this lecture</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-white/60">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </div>

          <aside className="rounded-3xl bg-white ring-1 ring-border p-4 max-h-[70vh] overflow-y-auto">
            <h3 className="font-display text-lg px-2 mb-2">Lectures</h3>
            {lectures.length === 0 && <p className="text-sm text-muted-foreground px-2">No lectures yet.</p>}
            <ul className="space-y-1">
              {lectures.map((l, i) => {
                const p = progressMap.get(l.id);
                const active = l.id === activeId;
                return (
                  <li key={l.id}>
                    <button
                      onClick={() => playLecture(l)}
                      className={`w-full text-left rounded-xl p-3 flex items-start gap-3 transition ${active ? "bg-muted" : "hover:bg-muted/60"}`}
                    >
                      <div className="mt-0.5">
                        {p?.completed ? <CheckCircle2 className="h-5 w-5 text-luxury" /> :
                          canPlay(l) ? <PlayCircle className="h-5 w-5 text-foreground/70" /> :
                          <Lock className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{i + 1}. {l.title}</div>
                        {l.duration_seconds > 0 && (
                          <div className="text-[11px] text-muted-foreground">{Math.round(l.duration_seconds / 60)} min</div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
