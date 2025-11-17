import os
import requests
import xarray as xr

url = os.environ.get("NETCDF_FILE_PATH", "waves_2019-01-01.nc")
local_file = "waves_2019-01-01.nc"

if not os.path.exists(local_file):
    r = requests.get(url)
    r.raise_for_status()
    with open(local_file, "wb") as f:
        f.write(r.content)

ds = xr.open_dataset(local_file, engine="netcdf4")
lat = 0.0
lon = 0.0
date = "2019-01-01"

max_hmax = (
    ds["hmax"]
    .sel(time=date)   
    .sel(latitude=lat, longitude=lon, method="nearest")
    .max(dim="time") 
    .item()
)

print(max_hmax)