import { useEffect, useState } from "react";

export function Component() {
  const [body, setBody] = useState<string | null>(null);
  useEffect(() => {
    void fetch("http://localhost")
      .then((res) => res.text())
      .catch(() => "Error fetching data")
      .then((text) => setBody(text));
  }, []);

  return <div>{body}</div>;
}
