"""Gunicorn configuration for production"""
import multiprocessing
import os

# Server socket
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes
workers = int(os.getenv("GUNICORN_WORKERS", multiprocessing.cpu_count() * 2 + 1))
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
graceful_timeout = 30

# Logging
accesslog = "/code/logs/gunicorn_access.log"
errorlog = "/code/logs/gunicorn_error.log"
loglevel = os.getenv("GUNICORN_LOG_LEVEL", "info")
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "credit_system"

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL (if terminating SSL at application level)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"

# Preload app for better performance
preload_app = True

# Server hooks
def on_starting(server):
    """Called just before the master process is initialized"""
    print("Starting Gunicorn server...")

def on_reload(server):
    """Called to recycle workers during a reload via SIGHUP"""
    print("Reloading Gunicorn server...")

def when_ready(server):
    """Called just after the server is started"""
    print(f"Gunicorn server is ready. Listening on: {bind}")

def worker_int(worker):
    """Called when a worker receives the SIGINT or SIGQUIT signal"""
    print(f"Worker {worker.pid} interrupted")

def worker_abort(worker):
    """Called when a worker receives the SIGABRT signal"""
    print(f"Worker {worker.pid} aborted")