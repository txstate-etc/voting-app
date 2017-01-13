import {connect} from 'react-redux';
import AdminIdea from '../components/AdminIdea.jsx';
import {makeGetIdea} from '../selectors/ideaSelectors';


// If the mapStateToProps argument supplied to connect returns a function instead of an object, 
// it will be used to create an individual mapStateToProps function for each instance of the container.
const makeMapStateToProps = () => {
    const getIdea = makeGetIdea()
    const mapStateToProps = (state, props) => {
        return {
            idea: getIdea(state, props),
            index: props.index
        }
    }
    return mapStateToProps;
}

const AdminIdeaContainer = connect(
  makeMapStateToProps
)(AdminIdea)

export default AdminIdeaContainer