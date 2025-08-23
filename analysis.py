# analysis.py
import pandas as pd
from io import StringIO

def analyze(csv_text: str) -> str:
    df = pd.read_csv(StringIO(csv_text))
    return df.describe(include="all").to_string()
