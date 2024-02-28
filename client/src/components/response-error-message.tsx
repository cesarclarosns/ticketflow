export function ResponseErrorMessage({
  message,
}: {
  message?: string[] | string | unknown;
}) {
  if (message) {
    if (Array.isArray(message)) {
      return (
        <div className="flex flex-col">
          {message.map((message, i) => {
            if (typeof message === 'string') return <p key={i}>{message}</p>;
          })}
        </div>
      );
    }

    if (typeof message === 'string') {
      return (
        <div className="flex">
          <p>{message}</p>
        </div>
      );
    }

    return null;
  }

  return null;
}
