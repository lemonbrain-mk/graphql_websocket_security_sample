import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Loading from "../components/Loading";
import { UserContext } from "Utils/UserContext";
import { getUser } from "Utils/Token";
import { globalNames } from "Utils/GetGlobals";

// eslint-disable-next-line no-unused-vars
import log from "Log";

const LOGOUT = gql`
    mutation logout {
        logout {
            authToken
            error
        }
    }
`;

const ME = gql`
    query me {
        me {
            uName
        }
    }
`;

class MeForm extends React.Component {
    render() {
        return (
            <div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                Me
                <p>
                    Welcome {this.props.data ? this.props.data.me.uName : ""}{" "}
                    {this.props.data ? this.props.data.me.anonymus : ""}
                    <button
                        onClick={() => {
                            this.props.logout();
                        }}
                    >
                        Sign out
                    </button>
                    <button
                        onClick={() => {
                            this.props.refetch();
                        }}
                    >
                        Refetch
                    </button>
                </p>
            </div>
        );
    }
}

MeForm.propTypes = {
    logout: PropTypes.func,
    refetch: PropTypes.func,
    data: PropTypes.object,
    answer: PropTypes.bool
};

Me.propTypes = {
    history: PropTypes.object
};

export default function Me({ history }) {
    const { data, refetch } = useQuery(ME);
    const [user, setUser] = useContext(UserContext);
    const [logout, { loading, error }] = useMutation(LOGOUT, {
        onCompleted({ logout: logoutAnswer }) {
            localStorage.setItem(globalNames.authToken, logoutAnswer.authToken);
            if(!user || user.uID !== getUser().uID) {
                setUser(getUser());
            }
            history.push("/login");
        }
    });

    useEffect(() => {
        refetch();
    }, [user]);

    if (loading) return <Loading />;
    if (error) return <p>An error occurred</p>;

    return <MeForm logout={logout} data={data} refetch={refetch} />;
}
