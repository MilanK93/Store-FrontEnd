import React from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { withNavigation } from "../../routeconf";
import TestAxios from "../../apis/TestAxios";

class Add extends React.Component {
  constructor(props) {
    super(props);

    let proizvodi = {
      naziv : "",
      cena: "",
      stanje: "",
      kategorija: null
  
    };

    this.state = { proizvodi : proizvodi, kategorija:[] };
  
  }

  componentDidMount() {
    this.getKategorija();
    }

    async getKategorija(){
        TestAxios.get("/kategorije")
        .then((response)=>{
            this.setState({kategorija:response.data});
        })
        .catch((err=>{console.log(err)}));
    }

   create = () => {

    let proizvodi = this.state.proizvodi
    let proizvodDto = {
      
      naziv: proizvodi.naziv,
      cena: proizvodi.cena,
      stanje: proizvodi.stanje,
      kategorijaId: proizvodi.kategorija.id,
      kategorijaNaziv: proizvodi.kategorija.naziv
    }

    TestAxios.post("/proizvodi", proizvodDto)
      .then((res) => {
        // handle success
        console.log(res);

        alert("Proizvod je uspesno dodat!");
        this.props.navigate("/proizvodi");
      })
      .catch((error) => {
        // handle error
        console.log(error);
        alert("Doslo je do greske!");
      });
  }

  onInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    console.log(value)

    let proizvodi = this.state.proizvodi;
    proizvodi[name] = value;

    this.setState({ proizvodi })
}

onKategorijaChange(e){

  let kategorijaId = e.target.value;
  let kategorija = this.state.kategorija.find((kategorija) => kategorija.id == kategorijaId);

  let proizvodi = this.state.proizvodi;
  proizvodi.kategorija = kategorija;

  this.setState({proizvodi: proizvodi});
}

  render() {
    return (
      <>
        <Row>
          <Col></Col>
          <Col xs="12" sm="10" md="8">
            <h1 style={{color: "blue"}}>Dodavanje proizvoda</h1>
            <Form>

              <Form.Label htmlFor="naziv">Naziv proizvoda</Form.Label>
              <Form.Control
                placeholder="Naziv Proizvoda"
                name="naziv"
                type="text"
                onChange={(e) => this.onInputChange(e)}
              />

              <Form.Label htmlFor="cena">Cena</Form.Label>
              <Form.Control
                placeholder="Cena proizvoda"
                name="cena"
                type="text"
                onChange={(e) => this.onInputChange(e)}
              />

              <Form.Label htmlFor="stanje">Stanje</Form.Label>
              <Form.Control
                placeholder="Stanje proizvoda"
                name="stanje"
                type="number"
                onChange={(e) => this.onInputChange(e)}
              />

              <Form.Group>
                    <Form.Label>Kategorija</Form.Label>
                    <Form.Select name="kategorija" onChange={(e)=>this.onKategorijaChange(e)}>
                        <option value=""></option>
                        {this.state.kategorija.map((kategorija)=>{
                            return(
                                <option value={kategorija.id}>{kategorija.naziv}</option>
                            );
                        })}
                    </Form.Select>
                </Form.Group>

              <Button style={{ marginTop: "25px" }} onClick={this.create}>
                Dodaj proizvod
              </Button>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </>
    );
  }
}

export default withNavigation(Add);
