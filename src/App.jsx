import React, { useState } from "react";
import { ethers } from "ethers";
import SecretKeyStorage from "./contracts/SecretKeyStorage.json"; // Assume you have the contract ABI and address

const App = () => {
  const [key, setKey] = useState("");
  const [wallet, setWallet] = useState("");
  const [accessAccount, setAccessAccount] = useState("");
  const [savedKeys, setSavedKeys] = useState([]);
  const [contract, setContract] = useState(null);

  // Connect to the Ethereum provider and initialize the contract
  const connectToBlockchain = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your actual contract address
        const contractABI = SecretKeyStorage.abi;
        const deployedContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(deployedContract);
      } else {
        console.error("No Ethereum provider found");
      }
    } catch (error) {
      console.error("Error connecting to the blockchain:", error);
    }
  };

  const handleSaveKey = async () => {
    try {
      await contract.storeSecretKey(key, wallet);
      setSavedKeys([...savedKeys, key]);
    } catch (error) {
      console.error("Error saving key:", error);
    }
  };

  const handleViewKeys = async () => {
    try {
      const keys = await contract.getSecretKeys();
      setSavedKeys(keys);
    } catch (error) {
      console.error("Error viewing keys:", error);
    }
  };

  const handleDeleteKey = async (keyToDelete) => {
    try {
      await contract.deleteSecretKey(keyToDelete);
      setSavedKeys(savedKeys.filter((key) => key !== keyToDelete));
    } catch (error) {
      console.error("Error deleting key:", error);
    }
  };

  const handleAddAccessAccount = async () => {
    try {
      await contract.setAccessableAccounts(accessAccount);
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
