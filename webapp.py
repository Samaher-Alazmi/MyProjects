import io
from PIL import Image
import cv2
from sklearn.preprocessing import LabelEncoder
import numpy as np
from re import DEBUG , sub
from flask import Flask,jsonify, render_template, request, redirect, send_file, url_for, Response
from werkzeug.utils import secure_filename, send_from_directory
import os
from subprocess import Popen
from ultralytics import YOLO


app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/signup/')
def signup():
    return render_template('signup.html')
@app.route('/signin/')
def signin():
    return render_template('signin.html')

@app.route('/update/')
def update():
    return render_template('update.html')

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/home/')
def home():
    return render_template('home.html')


@app.route('/upload/')
def upload():
    return render_template("upload.html")


@app.route("/upload/",methods=["GET","POST"])
def predict_img():

    if request.method == "POST":
        if "file" in request.files:
            f = request.files["file"]
            basepath = os.path.dirname(__file__)
            filepath = os.path.join(basepath,"uploads",f.filename)
            print("upload folder is ", filepath)
            f.save(filepath)
            global imgpath
            predict_img.imgpath = f.filename
            print("printing predict_img ::::::", predict_img)
            
            file_extension = f.filename.rsplit('.',1)[1].lower()
# or file_extension == "jpg" or file_extension == "gif" or file_extension == "png"
            if file_extension == "jpeg":
                img = cv2.imread(filepath)
                frame = cv2.imencode(".jpeg", cv2.UMat(img))[1].tobytes()
                image = Image.open(io.BytesIO(frame))
                # Perform the detection 
                yolo = YOLO("../yolov8_env/yolo8_Ffask_app/best.pt")
                detections = yolo.predict(image, save=True)
                
                for r in detections:
                     for c in r.boxes.cls:
                        print(yolo.names[int(c)])
                        cls = (yolo.names[int(c)])

                print("class name",cls)
               
                return display(f.filename)
            
        
        
    folder_path = '../runs/detect'
    subfolders = [f for f in os.listdir (folder_path) if os.path.isdir(os.path.join(folder_path, f))]
    latest_subfolder = max(subfolders, key=lambda x: os.path.getctime(os.path.join(folder_path, x)))
    image_path = folder_path+'/'+latest_subfolder+'/'+f.filename
    return render_template ('upload.html', image_path=image_path)
    # return "done"


#The display function is used to serve the image  from the folder_path directory.
@app.route('/<path:filename>')
def display (filename):
    folder_path = 'C:/Users/salaz/Desktop/yolov8_env/runs/detect'
    subfolders = [f for f in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, f))]
    print("subfolders",subfolders)
    latest_subfolder = max(subfolders, key=lambda x: os.path.getctime(os.path.join(folder_path, x)))
    print("latest_subfolder",latest_subfolder)
    directory = folder_path
    print("printing directory: ",directory)
    image_path = folder_path+'/'+latest_subfolder+'.jpeg'
    print("image_path",image_path)
    latest_file = latest_subfolder+'.jpeg'
    file_extension = image_path.rsplit('.', 1) [1].lower()
    environ = request.environ
    if file_extension == 'jpeg':
        return send_from_directory(directory, latest_file, environ) #shows the result in seperate tab
    else:
        return "Invalid file format"
    
if __name__ == '__main__':
    app.run(debug=True)
