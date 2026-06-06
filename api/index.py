import sys
import os
import importlib.util

# Load backend/api/index.py directly by file path (avoids circular import)
_backend_api = os.path.join(os.path.dirname(__file__), '..', 'backend', 'api', 'index.py')
_spec = importlib.util.spec_from_file_location("backend_api", _backend_api)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
app = _mod.app