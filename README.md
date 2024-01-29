# Open Graph Proxy

## Build image
```
docker build -t open-graph-proxy .
```

## Run container in background
```
docker run -d --name open-graph-proxy -p 7000:7000 -it open-graph-proxy
```
The port number after `:` can be modified to any port you prefer.
