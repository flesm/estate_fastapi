from fastapi import FastAPI

app = FastAPI(
    title="Estate App",
)


@app.get("/")
def main():
    return "Hello world!"
