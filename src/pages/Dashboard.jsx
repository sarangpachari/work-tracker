import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [workDetails, setWorkDetails] = useState({});


  useEffect(() => {
    fetchData();
  }, [workDetails]);

  const fetchData = async () => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser(data);
    }
  };

  const workWithTimestamp = {
    id: uuidv4(),
    ...workDetails,
    createdAt: new Date(),
  };

  const handleSaveWork = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "users", id);

    if (!workDetails.workTitle || !workDetails.workLocation) {
      alert("Please fill in Work Title and Location");
    } else {
      try {
        await updateDoc(docRef, {
          allPendingWorks: arrayUnion(workWithTimestamp),
        });

        // console.log("Work saved");
        setWorkDetails({});
        handleClose();
      } catch (error) {
        console.error("Error saving work:", error);
        alert("Failed to save work. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="m-3" style={{ height: "68vh" }}>
        <h6>Welcome to {user?.shopName} Dashboard</h6>
        <div className="w-100  my-3">
          <button onClick={handleShow} className="btn btn-outline-primary">
            Add Works
          </button>
        </div>
        {/* CARDS */}
        <div className="my-5 shadow">
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
            {/* PENDING WORKS DIV */}
            <Link
              to={`/pending-works/${id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="card text-white bg-danger mb-3"
                style={{ maxWidth: "20rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">
                    Pending Works{" "}
                    <span className="bg-white text-primary p-2">
                      {user?.allPendingWorks?.length}
                    </span>
                  </h5>
                </div>
              </div>
            </Link>
            {/* ATTENDED WORKS DIV */}
            <Link
              to={`/attended-works/${id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="card text-white bg-warning mb-3"
                style={{ maxWidth: "20rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">
                    Attended Works{" "}
                    <span className="bg-white text-primary p-2">
                      {user?.allAttendedWorks?.length}
                    </span>
                  </h5>
                </div>
              </div>
            </Link>
            {/* COMPLETED WORKS DIV */}
            <Link
              to={`/completed-works/${id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="card text-white bg-success mb-3"
                style={{ maxWidth: "20rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">
                    Completed Works{" "}
                    <span className="bg-white text-primary p-2">
                      {user?.allCompletedWorks?.length}
                    </span>
                  </h5>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* MODAL FOR ADD WORK */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Your Work</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* FORM TO WORK DETAILS */}
          <div className="">
            <input
              onChange={(e) =>
                setWorkDetails({ ...workDetails, workTitle: e.target.value })
              }
              type="text"
              placeholder="Work Title"
              className="form-control"
              required
            />
            <input
              onChange={(e) =>
                setWorkDetails({ ...workDetails, workLocation: e.target.value })
              }
              type="text"
              placeholder="Location"
              className="mt-3 form-control"
              required
            />
            <input
              onChange={(e) =>
                setWorkDetails({ ...workDetails, customerName: e.target.value })
              }
              type="text"
              placeholder="Customer Name"
              className="mt-3 form-control"
            />
            <input
              onChange={(e) =>
                setWorkDetails({ ...workDetails, customerPhone: e.target.value })
              }
              type="text"
              placeholder="Customer Phone"
              className="mt-3 form-control"
            />
            <textarea
              onChange={(e) =>
                setWorkDetails({
                  ...workDetails,
                  workDescription: e.target.value,
                })
              }
              type="text"
              placeholder="Work Description"
              className="mt-3 form-control"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => handleSaveWork(e)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard;
