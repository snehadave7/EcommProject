import React, { useEffect } from "react";
import { Table, Container, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { GetAllCustomer, Delete } from "../../service/adminUserSlice";

const AdminUser = () => {
  const { adminUserList, isLoading } = useSelector((state) => state.adminUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAllCustomer());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(Delete(id)).then((data) => {
        dispatch(GetAllCustomer());
      });
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h3" className="bg-dark text-white">
          User Management
        </Card.Header>
        <Card.Body>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="bg-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>UserName</th>
                  <th>Contact Number</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUserList.length > 0 ? (
                  adminUserList.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{`${user.firstName} ${user.lastName}`}</td>
                      <td>{user.userName}</td>
                      <td>{user.contactNumber}</td>
                      <td>{user.email}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminUser;
