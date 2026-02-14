"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Nav from "../../components/nav";
import { api } from "../../lib/api";

function randomKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function LearnPage() {
  const qc = useQueryClient();
  const lessons = useQuery({ queryKey: ["lessons"], queryFn: () => api("/lessons") });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const selectedLesson = useMemo(
    () => (lessons.data || []).find((lesson: any) => lesson.id === selectedId),
    [lessons.data, selectedId]
  );

  const submit = useMutation({
    mutationFn: () =>
      api(`/lessons/${selectedId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers, idempotency_key: randomKey() }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lessons"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  return (
    <div className="space-y-4">
      <Nav />
      <h1 className="text-2xl font-semibold">Learn</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <ul className="space-y-2">
          {(lessons.data || []).map((lesson: any) => (
            <li key={lesson.id}>
              <button className="w-full rounded bg-white p-3 text-left shadow" onClick={() => { setSelectedId(lesson.id); setAnswers({}); }}>
                {lesson.title} {lesson.completed ? "✅" : ""}
              </button>
            </li>
          ))}
        </ul>
        {selectedLesson && (
          <div className="rounded bg-white p-3 shadow">
            <h2 className="font-medium">{selectedLesson.title}</h2>
            <p className="mb-3 mt-1 text-sm">{selectedLesson.body}</p>
            {selectedLesson.quiz.map((q: any) => (
              <div key={q.id} className="mb-3">
                <p className="text-sm font-medium">{q.question}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {q.options.map((option: string) => (
                    <button
                      key={option}
                      className={`rounded border px-2 py-1 text-sm ${answers[q.id] === option ? "bg-mint" : "bg-white"}`}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: option }))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button className="rounded bg-ink px-3 py-2 text-white" onClick={() => submit.mutate()}>
              Submit Quiz
            </button>
            {submit.data && <p className="mt-2 text-sm">Score: {submit.data.score}%</p>}
          </div>
        )}
      </div>
    </div>
  );
}
