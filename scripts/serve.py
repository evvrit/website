"""Local server that behaves like GitHub Pages: /patterns/socks serves
patterns/socks.html, and unknown paths get 404.html (the router).
Usage: make serve"""
import http.server
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path):
        fs_path = pathlib.Path(super().translate_path(path))
        if not fs_path.exists() and fs_path.with_suffix(".html").is_file():
            return str(fs_path.with_suffix(".html"))
        return str(fs_path)

    def send_error(self, code, message=None, explain=None):
        if code != 404:
            return super().send_error(code, message, explain)
        body = (ROOT / "404.html").read_bytes()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)


if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("", 8080), Handler).serve_forever()
