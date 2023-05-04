import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode.react";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [schemaId, setSchemaId] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [createCredentialDefintionId, setCreateCredentialDefintionId] = useState(null);
  const [connectionId, setConnectionId] = useState(null);

  const SCHEMA_ID = "7KuDTpQh3GJ7Gp6kErpWvM:2:Hackaton-Poc_V2:1.3";
  const CRED_DEF_ID = "7KuDTpQh3GJ7Gp6kErpWvM:3:CL:47845:credPoc";


  useEffect(() => {


/*     const fetchSchema =async () => {
      const result = await axios.get(
        `https://gaiax.vereign.com/ocm/attestation/v1/schemas/${SCHEMA_ID}`
    )}; */



    
/*     const fetchSchemaData = async () => {
      try {
        const result = await axios.post(
          "https://gaiax.vereign.com/ocm/attestation/v1/schemas",
          {
            name: "Hackaton-Poc_V3",
            createdBy: "BenoitAndTobias",
            version: "1.3",
            attributes: ["firstname", "lastname"],
          }
        );
        console.log(result.data);
        setSchemaId(result.data.schemaId);
        setAttributes(result.data.attributes);
      } catch (error) {
        setError(error);
      }
    };
    fetchSchemaData(); */

      const fetchData = async () => {
      try {
        const result = await axios.post(
          "https://gaiax.vereign.com/ocm/connection/v1/invitation-url?alias=trust",
          {
            autoAcceptConnection: true,
            myLabel: "ConnexionRequest"
          }
        );
        console.log(result.data);
        console.log(result.data.data);
        console.log(result.data.data.invitationUrl);
        setData(result.data.data);
        setConnectionId(result.data.data.connection.id);
      } catch (error) {
        setError(error);
      }
    };  

   fetchData();

  

   const createCredentialDefintion = async () => {
    try {

      const createCredentialDefintion = await axios.get(
        "https://gaiax.vereign.com/ocm/attestation/v1/credentialDef/" + CRED_DEF_ID,
      );


/*       const result = await axios.post(
        "https://gaiax.vereign.com/ocm/attestation/v1/credentialDef",
        {
          schemaID: "7KuDTpQh3GJ7Gp6kErpWvM:2:Hackaton-Poc_V2:1.3",
          name: "credPoc",
          isRevokable: true,
          isAutoIssue: false,
          expiryHours: "6",
          createdBy: "BenoitAndTobias"
        }
      ); */
  
      setCreateCredentialDefintionId(createCredentialDefintion.data.credDefId)

    } catch (error) {
      console.log(error);
    }
    
   }
   createCredentialDefintion();

  


  }, []);


  async function  createOfferCredential () {
    console.log("create offer");
    const result = await axios.post(
    "https://gaiax.vereign.com/ocm/attestation/v1/create-offer-credential",
    {
        connectionId: connectionId,
        credentialDefinitionId: CRED_DEF_ID,
        comment: "BenoitAndTobias",
        attributes: [
          {
            name: "firstname",
            value: "Tobias"
          },
          {
            name: "lastname",
            value: "Mustermann"
          }
        ],
        autoAcceptCredential: "contentApproved"
    });
  }


  


  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Invitation URL:</h2>
      <p>{data.invitationUrl}</p>
      <h2>QR Code:</h2>
      {data && data.invitationUrl && <QRCode value={data.invitationUrl} />}

      <h2>Schema ID:</h2>
      <p>{schemaId}</p>
      <h2>Attributes:</h2>
      <ul>
        {attributes.map((attribute, index) => (
          <li key={index}>{attribute}</li>
        ))}
      </ul>

      <button onClick={createOfferCredential}>Create Credential</button>
    </div>

  );
}

export default App;