import React from "react";
import { getNotesForRequest, getNotesByServiceCode, type Note } from "../../services/notesApi";

type Props = {
  requestId?: string;
  serviceCode?: string;
  onClose: () => void;
  title?: string;
};

export function NotesModal({ requestId, serviceCode, onClose, title = "Notes" }: Props) {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!requestId && !serviceCode) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const fetch =
      requestId != null
        ? getNotesForRequest(requestId)
        : serviceCode
          ? getNotesByServiceCode(serviceCode)
          : Promise.resolve([]);
    fetch
      .then((list) => setNotes(Array.isArray(list) ? list : []))
      .catch((e: any) => setError(e?.response?.data?.message || e?.message || "Failed to load notes"))
      .finally(() => setLoading(false));
  }, [requestId, serviceCode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {loading && <div className="text-sm text-slate-400">Loading…</div>}
          {error && (
            <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-lg p-3">
              {error}
            </div>
          )}
          {!loading && !error && notes.length === 0 && (
            <div className="text-sm text-slate-500">No notes yet.</div>
          )}
          {!loading && !error && notes.length > 0 && (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li key={note.id} className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
                  <p className="text-sm text-slate-200 whitespace-pre-wrap">{note.description}</p>
                  {note.estimatedCost && (
                    <p className="text-xs text-slate-500 mt-1">Estimated cost: {note.estimatedCost}</p>
                  )}
                  {note.createdAt && (
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  )}
                  {note.images && note.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {note.images.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={url}
                            alt={`Note ${i + 1}`}
                            className="w-20 h-20 object-cover rounded border border-slate-700 hover:border-slate-500"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
