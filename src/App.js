import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SecretKeyStorage from "./contracts/SecretKeyStorage.json"; // Assume you have the contract ABI and address

const App = () => {
  const [key, setKey] = useState("");
  const [wallet, setWallet] = useState("");
  const [accessAccount, setAccessAccount] = useState("");
  const [savedKeys, setSavedKeys] = useState([]);
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);

  // Connect to the Ethereum provider and initialize the contract
  const connectToBlockchain = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);

        const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your actual contract address
        const contractABI = SecretKeyStorage.abi;
        const deployedContract = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        setContract(deployedContract);
      } else {
        console.error("No Ethereum provider found");
      }
    } catch (error) {
      console.error("Error connecting to the blockchain:", error);
    }
  };

  useEffect(() => {
    connectToBlockchain();
  }, []);

  const handleSaveKey = async () => {
    try {
      await contract.methods
        .storeSecretKey(key, wallet)
        .send({ from: (await web3.eth.getAccounts())[0] });
      setSavedKeys([...savedKeys, key]);
    } catch (error) {
      console.error("Error saving key:", error);
    }
  };

  const handleViewKeys = async () => {
    try {
      const keys = await contract.methods
        .getSecretKeys()
        .call({ from: (await web3.eth.getAccounts())[0] });
      setSavedKeys(keys);
    } catch (error) {
      console.error("Error viewing keys:", error);
    }
  };

  const handleDeleteKey = async (keyToDelete) => {
    try {
      await contract.methods
        .deleteSecretKey(keyToDelete)
        .send({ from: (await web3.eth.getAccounts())[0] });
      setSavedKeys(savedKeys.filter((key) => key !== keyToDelete));
    } catch (error) {
      console.error("Error deleting key:", error);
    }
  };

  const handleAddAccessAccount = async () => {
    try {
      await contract.methods
        .setAccessableAccounts(accessAccount)
        .send({ from: (await web3.eth.getAccounts())[0] });
    } catch (error) {
      console.error("Error adding access account:", error);
    }
  };

  return (
    <div className="App">
      <h1>Secret Key Management</h1>
      <button onClick={connectToBlockchain}>Connect to Blockchain</button>

      <div>
        <h2>Add Key</h2>
        <label>
          Key:
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </label>
        <label>
          Wallet Address:
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
        </label>
        <button onClick={handleSaveKey}>Save Key</button>
      </div>

      <div>
        <h2>Access Management</h2>
        <label>
          Accessible Account:
          <input
            type="text"
            value={accessAccount}
            onChange={(e) => setAccessAccount(e.target.value)}
          />
        </label>
        <button onClick={handleAddAccessAccount}>Add Access</button>
      </div>

      <div>
        <h2>View and Delete Keys</h2>
        <ul>
          {savedKeys.map((savedKey) => (
            <li key={savedKey}>
              {savedKey}{" "}
              <button onClick={() => handleDeleteKey(savedKey)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={handleViewKeys}>View Keys</button>
      </div>
    </div>
  );
};

export default App;
