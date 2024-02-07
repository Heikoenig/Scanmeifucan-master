from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from flask_cors import CORS
from PIL import Image
import pytesseract
import base64
from io import BytesIO
import re
import nltk
#nltk.download('stopwords')
#nltk.download('punkt')
#nltk.download('averaged_perceptron_tagger')
#nltk.download('maxent_ne_chunker')
#nltk.download('words')
from nltk.corpus import stopwords
stop = stopwords.words('english')

app = Flask(__name__)

CORS(app)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Configure the PostgreSQL database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:xYxFeKO!@localhost/ScanMeIfYouCan_DB_Alpha'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(15))
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    email = db.Column(db.String(255))
    profession = db.Column(db.String(255))
    mobile = db.Column(db.String(15))
    tel = db.Column(db.String(15))
    notes = db.Column(db.String(500))
    createdon = db.Column(db.DateTime(timezone=False), server_default=func.now())

# Ensure the app context is pushed
with app.app_context():
    # Create the database tables
    db.create_all()

# CRUD operations

# Create a new entry
@app.route('/api/contact', methods=['POST'])
def create_contact():
    data = request.get_json()

    create_contact_inner(data)

    return jsonify({'message': 'Contact created successfully'}), 201

# Read all entries
@app.route('/api/contact', methods=['GET'])
def get_all_contact():
    contact = Contact.query.all()
    contact_list = []
    for entry in contact:
        result_str = ""
        try:
            result_str += entry.firstname[0]
        except (TypeError, IndexError):
            # Handle the exception if str1 is None or has length 0
            print("firstname is None or empty")

        try:
            result_str += entry.lastname[0]
        except (TypeError, IndexError):
            print("lastname is None or empty")
        e = {
            'id': entry.id,
            'title': entry.title,
            'firstname': entry.firstname,
            'lastname': entry.lastname,
            'avatar': result_str,
            'email': entry.email,
            'profession': entry.profession,
            'mobile': entry.mobile,
            'tel': entry.tel,
            'notes': entry.notes,
            'createdon': entry.createdon
        }
        contact_list.append(e)

    return jsonify({'contact': contact_list})

# Read a specific entry by ID
@app.route('/api/contact/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    entry = Contact.query.get_or_404(contact_id)

    result_str = ""
    try:
        result_str += entry.firstname[0]
    except (TypeError, IndexError):
        # Handle the exception if str1 is None or has length 0
        print("firstname is None or empty")

    try:
        result_str += entry.lastname[0]
    except (TypeError, IndexError):
        print("lastname is None or empty")
    contact = {
        'id': entry.id,
        'title': entry.title,
        'firstname': entry.firstname,
        'lastname': entry.lastname,
        'avatar': result_str,
        'email': entry.email,
        'profession': entry.profession,
        'mobile': entry.mobile,
        'tel': entry.tel,
        'notes': entry.notes,
        'createdon': entry.createdon
    }

    return jsonify({'contact': contact})

# Update an entry by ID
@app.route('/api/contact/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    entry = Contact.query.get_or_404(contact_id)
    data = request.get_json()

    entry.title = data.get('title', entry.title)
    entry.firstname = data.get('firstname', entry.firstname)
    entry.lastname = data.get('lastname', entry.lastname)
    entry.email = data.get('email', entry.email)
    entry.profession = data.get('profession', entry.profession)
    entry.mobile = data.get('mobile', entry.mobile)
    entry.tel = data.get('tel', entry.tel)
    entry.notes = data.get('notes', entry.notes)

    db.session.commit()

    return jsonify({'message': 'Contact updated successfully'})

# Delete an entry by ID
@app.route('/api/contact/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    entry = Contact.query.get_or_404(contact_id)

    db.session.delete(entry)
    db.session.commit()

    return jsonify({'message': 'Contact deleted successfully'})


# Paged API call
@app.route('/api/contact/paged', methods=['GET'])
def get_paged_contact():
    # Get query parameters for pagination
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)

    # Paginate the query
    contact = Contact.query.paginate(page=page, per_page=per_page, error_out=False)

    contact_list = []

    for entry in contact.items:
        result_str = ""
        try:
            result_str += entry.firstname[0]
        except (TypeError, IndexError):
            print("firstname is None or empty")

        try:
            result_str += entry.lastname[0]
        except (TypeError, IndexError):
            print("lastname is None or empty")
        e = {
            'id': entry.id,
            'title': entry.title,
            'firstname': entry.firstname,
            'lastname': entry.lastname,
            'avatar': result_str,
            'email': entry.email,
            'profession': entry.profession,
            'mobile': entry.mobile,
            'tel': entry.tel,
            'notes': entry.notes,
            'createdon': entry.createdon
        } 
        contact_list.append(e)

    return jsonify({
        'contact': contact_list,
        'page': contact.page,
        'per_page': contact.per_page,
        'total_pages': contact.pages,
        'total_items': contact.total
    })

@app.route('/api/contact/ocr', methods=['POST'])
def ocr():
    try:
        data = request.get_json()

        # Get the Base64-encoded image from the request data
        base64_image = data.get('image')
        
        # Decode the Base64 string to binary data
        image_data = base64.b64decode(base64_image)

        image = Image.open(BytesIO(image_data))

        temp_image_path = 'temp_image.jpeg'
        image.save(temp_image_path)
        
        import os
        os.remove(temp_image_path)

        # Perform OCR using pytesseract
        print('----------------- print(ocr_result)')
        ocr_result = pytesseract.image_to_string(image)
        print(ocr_result)
        numbers = extract_phone_numbers(ocr_result)
        print('----------------- print(numbers)')
        print(numbers)
        print('----------------- print(emails)')
        emails = extract_email_addresses(ocr_result)
        print(emails)

        print('----------------- print(names)')
        names = extract_names(ocr_result)
        print(names)
        #org
        print('----------------- print(professions)')
        professions = extract_profession(ocr_result)
        print(professions)
        
        
        #print(names)
        #print(emails)
        #print(numbers)
        #print(professions)
        if(len(names) == 0):
            res = {
            'issuccess': False,
            'contact' : None
            }
            return jsonify(res), 400

        d = {
        'title': '',
        'firstname': names[0] if len(names) > 1 else '',
        'lastname': names[1] if len(names) > 1 else '',
        'email': emails[0] if len(emails) > 0 else '',
        'profession': professions[0] if len(professions) > 0 else '',
        'mobile': numbers[0] if len(numbers) > 0 else '',
        'tel': numbers[1] if len(numbers) > 1 else '',
        'notes': ''
        }

        create_contact_inner(d)
        res = {
        'issuccess': names[0] if True else False,
        'contact' : d
        }
        return jsonify(res), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_contact_inner(data):
    new_contact = Contact(
        firstname=data.get('firstname'),
        lastname=data.get('lastname'),
        email=data.get('email'),
        profession=data.get('profession'),
        mobile=data.get('mobile'),
        tel=data.get('tel'),
        notes=data.get('notes')
    )

    db.session.add(new_contact)
    db.session.commit()

def extract_phone_numbers(string):
    r = re.compile(r'(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})')
    phone_numbers = r.findall(string)
    return [re.sub(r'\D', '', number) for number in phone_numbers]

def extract_email_addresses(string):
    r = re.compile(r'[\w\.-]+@[\w\.-]+')
    return r.findall(string)


def ie_preprocess(document, useStop= True):
    if useStop:
        document = ' '.join([i for i in document.split() if i not in stop])
    sentences = nltk.sent_tokenize(document)
    sentences = [nltk.word_tokenize(sent) for sent in sentences]
    sentences = [nltk.pos_tag(sent) for sent in sentences]
    return sentences

def ie_preprocess_prof(document):
    document = ' '.join([i for i in document.split() if i not in stop])
    sentences = nltk.sent_tokenize(document)
    sentences = [nltk.word_tokenize(sent) for sent in sentences]
    sentences = [nltk.pos_tag(sent) for sent in sentences]
    return sentences

def extract_names(document):
    try:
        names = []
        sentences = ie_preprocess(document)
        for tagged_sentence in sentences:
            for chunk in nltk.ne_chunk(tagged_sentence):
                if type(chunk) == nltk.tree.Tree:
                    if chunk.label() == 'PERSON':
                        names.append(' '.join([c[0] for c in chunk]))
        return names
    except Exception as e:
        print (str(e))

def extract_org(document):
    orgs = []
    sentences = ie_preprocess(document, False)
    for tagged_sentence in sentences:
        for chunk in nltk.ne_chunk(tagged_sentence):
            if type(chunk) == nltk.tree.Tree:
                if chunk.label() == 'ORGANIZATION':
                    orgs.append(' '.join([c[0] for c in chunk]))
    return orgs

def extract_profession(document):
    professions = []
    sentences = ie_preprocess_prof(document)
    for tagged_sentence in sentences:
        for chunk in nltk.ne_chunk(tagged_sentence):
            if type(chunk) == nltk.tree.Tree:
                l = chunk.label()
                if l == 'NN' or l == 'NNS':
                    professions.append(' '.join([c[0] for c in chunk]))
    return professions

if __name__ == '__main__':
    app.run(debug=True)
