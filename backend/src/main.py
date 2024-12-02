from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth.router import router as router_auth
from specialist.router import router as router_spec
from admin.router import router as router_admin
from estate.router import router as router_estate
from report.router import router as router_report
from news.router import router as router_news
from maps.router import router as router_maps

app = FastAPI(
    title="Estate App",
)
app.include_router(router_auth)
app.include_router(router_spec)
app.include_router(router_admin)
app.include_router(router_estate)
app.include_router(router_report)
app.include_router(router_news)
app.include_router(router_maps)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



