import pandas as pd
from flask import Flask, request

app=Flask(__name__)

@app.route('/log_activity',methods=['POST'])
def log_activity():
    data=request.json
    df=pd.DataFrame([data])
    try:
        df_existing=pd.read_excel("user_data.xlsx")
        df=pd.concat([df_existing,df],ignore_index=True)
    except FileNotFoundError:
        pass
    df.to_excel("user_data.xlsx",index=False)
    return {"status":"success"}

if __name__=="__main__":
    app.run(debug=True)
