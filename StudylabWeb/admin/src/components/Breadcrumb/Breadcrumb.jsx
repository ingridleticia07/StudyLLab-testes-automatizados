import { Link } from 'react-router-dom';

const Breadcrumb = ({ page }) => {
    return (
        <p className='text-gray-500 font-bold mb-2'>
            <Link to='/'>Página Inicial</Link> &gt; {page}
        </p>
    );
};

export default Breadcrumb;
