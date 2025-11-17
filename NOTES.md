# Answer to Question 3

### Basic steps I would take:
1. Understand the basic user requirements.  
2. Design a strategy by researching methods like chunking large NetCDF files, distributed processing with Dask or Ray, server-side processing, and lazy loading of data.  
3. Compare different tools like xarray, NetCDF4, and cloud-friendly storage formats like Zarr for storing and processing wave height data efficiently.  
4. Prototype to measure runtime and memory usage for fetching/processing each (lat,lon) point, test both in-memory and S3-based approaches.  
5. Implement caching and pre-computation, calculating and storing maximum wave heights for each lat and lon to reduce repeated heavy computations.  
6. Design a backend API using effective strategies learnt through prototyping and testing.  
7. Test the end-to-end workflow, spot bottlenecks in dataset loading, API response, frontend rendering, optimize for speed and minimal memory usage.  
8. Deploy

### Main Concerns
- Large amounts of data points (high compute + memory required)
- Runtime of xarray processing due to dataset size and possibly slow I/O
- Choosing chunk sizes that balance compute and memory
- Best possible data structures and cloud storage formats for faster access like Zarr.
- Memory concerns since loading global data across decades is not feasible without chunking or lazy loading
- Latency and request response time (looking towards caching etc.)
- Scalability as user base increases

After computing the global max map once, I would persist it into a cloud-friendly format like Zarr so the application can read it quickly without scanning decades of raw NetCDF files again.

# Answer to Question 4

1. Who is the target audience? casual map users or marine scientists who need more detailed data?

2. System might not be able to handle all of those points in memory at the same time, could we reduce temporal resolution or use adaptive temporal resolution for animation, hourly for recent years, daily/monthly for older decades, to balance fidelity and performance?

3. Would it make sense to pre-render visual tiles at the edges to reduce latency for users globally?

4. Do we assume the UI should support global coverage immediately, or is it realistic to load only user-selected regions first?

5. Are there key exploratory workflows we need to support, such as comparing historical extremes across regions or exporting data for analysis?

# Overall Approach

### 1. Split the application into two independent layers
- **Python backend** — best suited for heavy data processing with xarray.
- **Next.js frontend** — ideal for interactive UIs and map rendering.

### 2. Next.js Frontend
- Integrates well with Mapbox and react-map-gl.
- Fast development workflow.
- Easy deployment via Vercel or Netlify.

### 3. Python-Based Backend
- Best tools for reading and processing NetCDF files.
- Simple to build clean APIs.
- FastAPI provides a great balance of speed, structure, and lightweight design.

### 4. S3 Bucket
- Scalable storage.
- Keeps deployment lightweight by avoiding large bundled datasets.

### 5. Deployment
- **Next.js on Netlify**  
  - Automatic CI/CD  
  - Simple integration

- **FastAPI on Railway**  
  - Rapid API deployment  
  - Clean and minimal setup

# 2. Trade-offs Made to Meet the Time Limit

a. **Ignored scalability for faster development.**  
   - For production, I would preprocess and store pre-computed wave values per lat/lon in a database or tile-based structure.

b. **Skipped caching to save time.**  
   - I would implement API-level caching (e.g., Redis) to drastically reduce request latency and repeated NetCDF loads.

c. **Relaxed strict typing and validation.**  
   - I would use mypy, pydantic models, and clear validation rules to reduce bugs.

d. **Chose simple deployment platforms (Netlify + Railway).**  
   - I would move to AWS with proper CI/CD, autoscaling, infrastructure-as-code, and staging environments.

e. **Skipped unit, integration, and load testing.**  
   - I would add full testing coverage for API endpoints, frontend interactions, and heavy-load behavior.

f. **Minimal logging and no monitoring.**  
   - I would implement structured logs, metrics dashboards, and alerting for API failures or dataset issues.

g. **Skipped backend security and rate limiting.**  
   - I would add API keys/JWT authentication, HTTPS, rate limiting, and sanitization.

h. **No UI polish or state handling due to time constraints.**  
   - I would add loading states, error messages, responsive design, and smoother UX interactions.

# AI Usage
- I used AI for debugging deployment issues, writing HTML styles, and formatting this document in Markdown.

# Notes

### Features I wanted to add but couldn’t due to time
- A form to enter and search latitude and longitude instead of clicking.
- A click history component showing all previously selected coordinates and their wave height values.
- Enable users to select custom date.
- Multi-lingual support.
- Enable side-by-side comparison of wave heights at multiple points.