interface Props {
  content: string;
}

export function PreviewResume({ content }: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">Customized Preview</h3>
      <div className="mt-2 border rounded-lg p-4 bg-gray-50 h-96 overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
          {content}
        </pre>
      </div>
    </div>
  );
}