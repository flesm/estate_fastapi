from fastapi import FastAPI
from auth.router import router as router_auth
from specialist.router import router as router_spec
from admin.router import router as router_admin

app = FastAPI(
    title="Estate App",
)
app.include_router(router_auth)
app.include_router(router_spec)
app.include_router(router_admin)



