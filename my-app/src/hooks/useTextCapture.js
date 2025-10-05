import { useEffect } from "react";
import debounce from "lodash.debounce";

export default function useTextCapture(onCapture) {
  useEffect(() => {
    const handleMouseUp = debounce(() => {
      const selected = window.getSelection().toString().trim();
      if (selected) onCapture(selected);
    }, 600);

    const handleClick = debounce((e) => {
      const text = e.target.textContent?.trim();
      if (text && text.length < 500) onCapture(text);
    }, 600);

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClick);
    };
  }, [onCapture]);
}
