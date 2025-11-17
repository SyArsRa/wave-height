import datetime
import math
import uvicorn
import logging
from fastapi import (
    FastAPI, HTTPException, Query
)
from fastapi.middleware.cors import CORSMiddleware
import xarray as xr


import os

import dotenv
dotenv.load_dotenv()

FILE_PATH = os.environ.get("NETCDF_FILE_PATH", "waves_2019-01-01/waves_2019-01-01.nc")

log = logging.getLogger("uvicorn")
log.setLevel(logging.INFO)

app_url: str = os.environ.get("APP_URL", "127.0.0.1")
app: FastAPI = FastAPI()
origins: list[str] = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root() -> dict[str, str]:
    return {"message": "Welcome to the API"}

@app.get("/api/hmax")
async def get_hmax(
    lat: float = Query(...),
    lon: float = Query(...),
    date: str = Query(...)  # pass as 'YYYY-MM-DD'
):
    ds = xr.open_dataset(FILE_PATH)
    dt = datetime.datetime.strptime(date, "%Y-%m-%d")
    try:
        max_hmax = (
            ds["hmax"]
            .sel(time=dt.strftime("%Y-%m-%d"))
            .sel(latitude=lat, longitude=lon, method="nearest")
            .max(dim="time")
            .item()
        )
    except Exception as e:
        log.error(f"Error retrieving hmax: {e}")
        raise HTTPException(status_code=500, detail="Could not retrieve hmax for the given parameters")
    
    
    if max_hmax is None or math.isnan(max_hmax):
        raise HTTPException(status_code=404, detail="No data found for the given parameters")

    return {"max_hmax": max_hmax}

if __name__ == "__main__":
    print("app running on ", app_url)
    uvicorn.run("main:app", host=app_url, port=8000)
