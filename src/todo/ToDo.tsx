import { useEffect, useState } from "react";
import "./ToDo.scss";
import axios from "axios";

// ToDo interface
interface ToDo {
  toDoId: string;
  title: string;
  description: string;
}

const ToDo: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  // UseState for ToDo
  const [toDo, setToDo] = useState<ToDo>({
    toDoId: "",
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  // Handle change function for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDo({ ...toDo, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle submit function to post data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (toDo.title.trim() === "" || toDo.description.trim() === "") {
      setError("Fields can't be empty");
      return;
    }
    setIsLoading(true);
    try {
      const newToDo: ToDo = toDo;
      const response = await axios.post(`${apiUrl}/todos`, newToDo);
      setToDo({ toDoId: "", title: "", description: "" });
      console.log(response.data);
      setRefresh(true);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetching data from backend (get todos)
  useEffect(() => {
    const fetchToDos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/todos`);
        setToDos(response.data as ToDo[]);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
        setRefresh(false);
      }
    };
    fetchToDos();
  }, [refresh]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error occurred: {error}</p>;
  }

  // Delete ToDo
  const deleteToDo = async (toDoId: string) => {
    try {
      await axios.delete(`${apiUrl}/todos/${toDoId}`);
      setRefresh(true);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <form onSubmit={handleSubmit}>
          <div className="container pt-3 pb-3">
            <div className="mb-3">
              <label>Title: </label>
              <input
                type="text"
                placeholder="enter title"
                className="input-title"
                onChange={handleChange}
                name="title"
              />
            </div>

            <div className="mb-3">
              <label>Description: </label>
              <input
                type="text"
                placeholder="enter description"
                className="input-desc"
                onChange={handleChange}
                name="description"
              />
            </div>

            <div className="mb-3">
              <button className="btn btn-primary">
                {isLoading ? "POSTING" : "POST"}
              </button>
            </div>

            <div>
              <p>{error}</p>
            </div>
          </div>
        </form>
      </div>

      <div className="mb-3">
        <div className="container">
          <p className="header">ToDo List</p>
          {toDos.map((eachToDo, index) => (
            <div key={index}>
              <div className="todo-container">
                <div>
                  <p className="eachtodo-title">{eachToDo.title}</p>
                  <p>{eachToDo.description}</p>
                </div>
                <div>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteToDo(eachToDo.toDoId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToDo;
