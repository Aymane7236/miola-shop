import React from 'react';
import { Card, Form, Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import axios from '../axiosConfig';
import MyToast from './MyToast';
import { withRouter } from '../withRouter';

class Voiture extends React.Component {
  initialState = {
    marque: '',
    modele: '',
    couleur: '',
    immatricule: '',
    prix: '',
    annee: '',
    show: false
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  componentDidMount() {
    const { id } = this.props.params;
    if (id) {
      this.loadVoiture(id);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      if (this.props.params.id) {
        this.loadVoiture(this.props.params.id);
      } else {
        this.setState(this.initialState);
      }
    }
  }

  loadVoiture(id) {
    axios.get('/voitures/' + id)
      .then(response => {
        const v = response.data;
        this.setState({
          marque:      v.marque,
          modele:      v.modele,
          couleur:     v.couleur,
          immatricule: v.immatricule,
          prix:        v.prix,
          annee:       v.annee
        });
      });
  }

  resetVoiture = () => {
    this.setState(() => this.initialState);
  };

  voitureChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitVoiture = (event) => {
    event.preventDefault();
    const { marque, modele, couleur, immatricule, prix, annee } = this.state;
    const { id } = this.props.params;
    const voiture = {
      marque,
      modele,
      couleur,
      immatricule,
      prix:  parseInt(prix,  10),
      annee: parseInt(annee, 10)
    };

    if (id) {
      axios.put('/voitures/' + id, voiture)
        .then(response => {
          if (response.data) {
            this.setState({ show: true });
            setTimeout(() => {
              this.setState({ show: false });
              this.props.navigate('/list');
            }, 2000);
          }
        });
    } else {
      axios.post('/voitures', voiture)
        .then(response => {
          if (response.data) {
            this.setState({ ...this.initialState, show: true });
            setTimeout(() => this.setState({ show: false }), 3000);
          }
        });
    }
  };

  render() {
    const { marque, modele, couleur, immatricule, prix, annee, show } = this.state;
    const { id } = this.props.params;
    const isEdit = Boolean(id);

    return (
      <div>
        <div style={{ display: show ? 'block' : 'none' }}>
          <MyToast children={{
            show,
            message: isEdit
              ? 'Voiture modifiée avec succès.'
              : 'Voiture enregistrée avec succès.',
            type: 'success'
          }} />
        </div>

        <Card className="border border-dark bg-dark text-white">
          <Card.Header>
            <FontAwesomeIcon icon={faPlusSquare} />
            {isEdit ? ' Modifier la Voiture' : ' Ajouter une Voiture'}
          </Card.Header>

          <Form onReset={this.resetVoiture} onSubmit={this.submitVoiture} id="VoitureFormId">
            <Card.Body>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridMarque">
                  <Form.Label>Marque</Form.Label>
                  <Form.Control
                    required name="marque" type="text"
                    value={marque} autoComplete="off"
                    onChange={this.voitureChange}
                    className="bg-dark text-white"
                    placeholder="Entrez Marque Voiture"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridModele">
                  <Form.Label>Modele</Form.Label>
                  <Form.Control
                    required name="modele" type="text"
                    value={modele} autoComplete="off"
                    onChange={this.voitureChange}
                    className="bg-dark text-white"
                    placeholder="Entrez Modele Voiture"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCouleur">
                  <Form.Label>Couleur</Form.Label>
                  <Form.Control
                    required name="couleur" type="text"
                    value={couleur} autoComplete="off"
                    onChange={this.voitureChange}
                    className="bg-dark text-white"
                    placeholder="Entrez Couleur Voiture"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridImmatricule">
                  <Form.Label>Immatricule</Form.Label>
                  <Form.Control
                    required name="immatricule" type="text"
                    value={immatricule} autoComplete="off"
                    onChange={this.voitureChange}
                    className="bg-dark text-white"
                    placeholder="Entrez Immatricule Voiture"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPrix">
                  <Form.Label>Prix</Form.Label>
                  <Form.Control
                    required name="prix" type="number"
                    value={prix} autoComplete="off"
                    onChange={this.voitureChange}
                    className="bg-dark text-white"
                    placeholder="Entrez Prix Voiture"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridAnnee">
                  <Form.Label>Annee</Form.Label>
                  <Form.Control
                    required name="annee" type="number"
                    value={annee} autoComplete="off"
                    onChange={this.voitureChange}
                    className="bg-dark text-white"
                    placeholder="Entrez Annee Voiture"
                  />
                </Form.Group>
              </Row>
            </Card.Body>

            <Card.Footer style={{ textAlign: 'right' }}>
              <Button size="sm" variant="success" type="submit">
                <FontAwesomeIcon icon={faSave} /> {isEdit ? 'Modifier' : 'Submit'}
              </Button>{' '}
              <Button size="sm" variant="info" type="reset">
                <FontAwesomeIcon icon={faUndo} /> Reset
              </Button>
            </Card.Footer>
          </Form>
        </Card>
      </div>
    );
  }
}

export default withRouter(Voiture);
