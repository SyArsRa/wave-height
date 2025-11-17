import xarray as xr

file_path = 'waves_2019-01-01\\waves_2019-01-01.nc'  # Replace with the actual path to your .nc file
ds = xr.open_dataset(file_path)

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