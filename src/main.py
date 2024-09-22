from fastapi import FastAPI
from auth.router import router as router_operation

app = FastAPI(
    title="Estate App",
)

app.include_router(router_operation)
