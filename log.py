import datetime
import logging
import sys
from logging import getLogger
from pathlib import Path


def initLog():
    logger = getLogger(__name__)
    logger.setLevel(logging.INFO)
    log_foldername = Path("./logs")
    log_filename = f"{datetime.datetime.now().strftime('%Y-%m-%d-%H-%M')}.log"
    if not log_foldername.exists():
        log_foldername.mkdir()
    if not log_foldername.exists():
        (log_foldername / log_filename).touch()
    file_handler = logging.FileHandler(log_foldername / log_filename)
    stream_handler = logging.StreamHandler(sys.stdout)
    logger.addHandler(file_handler)
    logger.addHandler(stream_handler)
    return logger
