/**
 * Renders the markdown-lite used in src/content/posts.ts:
 * blank-line separated blocks, `## ` headings, and `- ` list items.
 * Inline `code` spans are supported.
 */
function inline(text: string, keyPrefix: string) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    return <span key={key}>{part}</span>;
  });
}

export function ArticleBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n{2,}/);

  return (
    <div className="prose-article max-w-2xl">
      {blocks.map((block, blockIndex) => {
        const key = `block-${blockIndex}`;

        if (block.startsWith("## ")) {
          return <h2 key={key}>{inline(block.slice(3), key)}</h2>;
        }

        if (block.startsWith("- ")) {
          const items = block.split("\n").filter((line) => line.startsWith("- "));
          return (
            <ul key={key} className="ml-5 list-disc">
              {items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{inline(item.slice(2), `${key}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }

        return <p key={key}>{inline(block, key)}</p>;
      })}
    </div>
  );
}
