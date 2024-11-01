from fastapi import FastAPI
from auth.router import router as router_auth
from specialist.router import router as router_spec
from admin.router import router as router_admin
from estate.router import router as router_estate
from report.router import router as router_report
from news.router import router as router_news

app = FastAPI(
    title="Estate App",
)
app.include_router(router_auth)
app.include_router(router_spec)
app.include_router(router_admin)
app.include_router(router_estate)
app.include_router(router_report)
app.include_router(router_news)



