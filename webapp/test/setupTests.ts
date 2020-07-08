import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { initTest } from './initTest';
const adapter = new Adapter();
Enzyme.configure({ adapter });
initTest();
