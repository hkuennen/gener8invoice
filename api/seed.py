import os
from pdf import db
from pdf.models import User, Biller, Recipient

def seed_db():
    print("Clearing database...")
    db.session.query(User).delete()
    db.session.query(Biller).delete()
    db.session.query(Recipient).delete()
    db.session.commit()
    print("Database cleared!")

    print("Seeding database...")

    print("Creating user...")
    password = os.getenv("USR_PW")
    iban = os.getenv("IBAN")

    jamil = User(username="jamil", password=password, first_name="Jamil", last_name="Akkad")
    print("User created!")

    print("Creating biller...")
    biller = Biller(email="lindent@zahnarzt-lindern.de", name="LinDent", street="Werlter Str. 2", zip_code="49699", city="Lindern",
                    tax_number="56/101/14396", account_holder="LinDent Dentallabor", bank_name="Volksbank Löningen eG",
                    iban=iban, bic="GENODEF1LOG", user=jamil)
    print("Biller created!")

    print("Creating recipient...")
    recipient = Recipient(email="info@za-kluesener.de", name="Praxislabor Dr. D. Klüsener", street="Kettelerstr. 9", zip_code="49688",
                          city="Lastrup", user=jamil)
    print("Recipient created!")

    db.session.add(jamil)
    db.session.add(biller)
    db.session.add(recipient)

    db.session.commit()
    print("Database seeded!")
