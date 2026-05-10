"use client";
"use client";

// src/components/elements/ssr-layout-effect.tsx
import { useLayoutEffect } from "react";
import { jsx } from "react/jsx-runtime";
function SsrScript(props) {
  useLayoutEffect(() => {
    try {
      (0, eval)(props.script);
    } catch (error) {
      console.warn(
        "[SsrScript] Skipped script eval due to CSP restrictions",
        error
      );
    }
  }, []);
  return /* @__PURE__ */ jsx(
    "script",
    {
      suppressHydrationWarning: true,
      nonce: props.nonce,
      dangerouslySetInnerHTML: { __html: props.script }
    }
  );
}
export {
  SsrScript
};
//# sourceMappingURL=ssr-layout-effect.js.map
