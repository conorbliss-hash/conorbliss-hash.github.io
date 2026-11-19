import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import IntelligenceOnTap from "./pages/IntelligenceOnTap";

// Lazy routes render nothing on the server, so the tool page is rendered directly.
export function renderTool() {
  return renderToString(
    <StrictMode>
      <StaticRouter location="/intelligence-on-tap">
        <IntelligenceOnTap />
      </StaticRouter>
    </StrictMode>,
  );
}

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
