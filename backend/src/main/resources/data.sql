-- Donnees initiales : 10 voitures style marocain
-- Ce fichier est execute APRES la creation du schema par Hibernate
-- (spring.jpa.defer-datasource-initialization=true)

INSERT INTO VOITURE (ID, MARQUE, MODELE, COULEUR, IMMATRICULE, ANNEE, PRIX) VALUES
(1,  'Dacia',      'Logan',    'Gris',  'A-1-1234',  2020, 95000),
(2,  'Renault',    'Clio',     'Rouge', 'B-2-5678',  2019, 120000),
(3,  'Peugeot',    '208',      'Blanc', 'A-3-9012',  2021, 165000),
(4,  'Toyota',     'Yaris',    'Bleu',  'C-4-3456',  2018, 110000),
(5,  'Hyundai',    'i10',      'Noir',  'A-5-7890',  2022, 130000),
(6,  'Volkswagen', 'Polo',     'Gris',  'D-6-1234',  2020, 180000),
(7,  'Hyundai',    'Accent',   'Noir',  'A-7-5678',  2021, 210000),
(8,  'Audi',       'A3',       'Blanc', 'B-8-9012',  2019, 280000),
(9,  'BMW',        'Serie 3',  'Noir',  'A-9-3456',  2022, 380000),
(10, 'Mercedes',   'Classe C', 'Gris',  'C-10-7890', 2023, 450000);

-- Reinitialiser les sequences pour eviter les conflits avec les insertions Hibernate
ALTER SEQUENCE IF EXISTS voiture_seq RESTART WITH 100;
ALTER SEQUENCE IF EXISTS proprietaire_seq RESTART WITH 100;
