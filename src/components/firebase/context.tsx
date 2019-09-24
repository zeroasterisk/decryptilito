import React from 'react';

import FirebaseClass from './firebase';

const FirebaseContext = React.createContext<FirebaseClass | null>(null);

interface WithFirebaseProps {
  firebase?: FirebaseClass;
}
// export const withFirebase = Component => props => (
//   <FirebaseContext.Consumer>
//     {firebase => <Component {...props} firebase={firebase} />}
//   </FirebaseContext.Consumer>
// );
export const withFirebase = <P extends object>(
  Component: React.ComponentType<P>,
) =>
  class WithFirebase extends React.Component<P & WithFirebaseProps> {
    public render() {
      return (
        <FirebaseContext.Consumer>
          {firebase =>
            firebase ? (
              <Component
                {...({ ...{ firebase }, ...this.props } as P &
                  WithFirebaseProps)}
              />
            ) : (
              '!!!'
            )
          }
        </FirebaseContext.Consumer>
      );
    }
  };

/*
export const withFirebase = <P extends object>(Component: React.ComponentType<P>) =>
  class WithFirebase extends React.Component<P & WithFirebaseProps> {
    public render() {
      const { firebase } = this.props;
      return firebase ? <p>No Firebase</p> : <Component {...this.props as P} />;
    }
  };
export function withFirebase<Props>(WrappedComponent: React.ComponentType<Props>) {
  return (props: Props & WithFirebaseProps) => (
      <FirebaseContext.Consumer>
        {firebase => {
          const allProps = {props, ...{ firebase }};
          return <WrappedComponent {...allProps as Props} />
        }}
      </FirebaseContext.Consumer>
    );
};

/*
function withFirebase<T extends WithFirebaseProps>(Component: React.ComponentType<T>) {
  return class extends React.Component<Subtract<T, WithFirebaseProps>> {
    state = { firebase: [] as string[] };
    async componentDidMount() {
      const things = await getThings();
      this.setState({ things });
    }
    render() {
      return <Component {...this.props as T} things={this.state.things} />;
    }
  };
}
*/

export default FirebaseContext;
