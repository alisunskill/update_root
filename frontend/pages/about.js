import Title from '../components/Title';
import { useState } from "react";
// import { object } from "yup";


export default function About() {
    // basics states for getting values
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [address, setAdress] = useState("");
    // state for bind data of all
    const [users, setUser] = useState([]);
    // state for edit content
    const [edit, setEdit] = useState(false);
    // state for update content
    const [active, setActive] = useState(null);
  
    // Add Data
    const addUser = (e) => {
      e.preventDefault();
      const user = {
        name,
        mail,
        address,
      };
      setUser([...users, user]);
      setActive(true)
      // update user
      if (edit) {
        let copy = users;
        Object.assign(copy[active], user);
        setUser([...copy]);
        setEdit(false);
        setActive(null);
      } else {
        // add user
        setUser([...users, user]);
      }
      setName("");
      setMail("");
      setAdress("");
    };
    // Edit Data
    const onEditClick = (index) => {
      const edit = users[index];
      setName(edit.name);
      setMail(edit.mail);
      setAdress(edit.address);
      setEdit(true);
      setActive(index);
    };
    // Delete User
    const delHandle = (user) => {
      if (window.confirm("Are you sure you want to delete")) {
        let copy = users.filter((item) => item !== user);
        setUser([...copy]);
      }
    };
  return (
    <div className='p-5'>
      <Title title="About" />
      <h1>About Page</h1>
      <hr />
      <div>
      <div className="container pt-5 py-3">
        <h2 className="bg-success p-2 text-light">Sir Jensen</h2>
        <div className="row">
          <div className="col">
            <form className="" onSubmit={addUser}>
              <div className="form-group">
                <h3>Name</h3>
                <input
                  type="text"
                  className="fonm-control border"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <h3>Email</h3>
                <input
                  type="email"
                  className="fonm-control border"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <h3>Aaddress</h3>
                <input
                  type="text"
                  className="fonm-control border"
                  value={address}
                  onChange={(e) => setAdress(e.target.value)}
                />
              </div>
              <button className="btn btn-success form-control mt-3">
                {edit ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="pt-5 py-3">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Adress</th>
              <th>Edit</th>
              <th>Delet</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.mail}</td>
                  <td>{user.address}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => onEditClick(index)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => delHandle(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
      </div>
  )
}
