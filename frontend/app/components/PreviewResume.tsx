interface Props {
  content: string;
}

export function PreviewResume({ content }: Props) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2 text-green-700">Customized Resume</h2>
      <pre className="border rounded-lg p-4 bg-gray-100 max-h-96 overflow-auto whitespace-pre-wrap">{content}</pre>
    </div>
  );
}