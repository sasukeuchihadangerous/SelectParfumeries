import RequireAuth from '../../../components/RequireAuth'
import ParfumService from '../../../API/ParfumService'
import Footer from '../../../components/UI/Footer/Footer'
import styles from '../../../styles/admin.module.scss'
import AdminAside from '../../../components/UI/Admin/AdminAside/AdminAside'
import AdminParfums from '../../../components/Admin/AdminParfums/AdminParfums'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const AdminPage = ({ fetchparfums, parfumscount, page }) => {
    const router = useRouter();
    const setPage = (page, pathquery) => {
        router.push({ pathname: '/admin/page/'+ page, query: { ...pathquery } }  );
    }
    const removeParfum = (id) => {
        setParfums(parfums.filter(e => e._id !== id));
    }
    const [parfums, setParfums] = useState(fetchparfums);
    useEffect(() => {
        setParfums(fetchparfums);
    }, [page, router.query])
    

    return (
        <RequireAuth>
            <div className={styles.admin}>
                <div className={[styles.inner].join(' ')}>
                    <AdminAside></AdminAside>
                    <AdminParfums removeParfum={removeParfum} data={parfums} count={parfumscount} page={page} setPage={setPage}></AdminParfums>
                </div>
            </div>
            <Footer className={styles.footer}></Footer>
        </RequireAuth>
    )
}

export async function getServerSideProps(context) {
    const page = context.params.page;

    const {raspiv, s} = context.query;

    let payload = {limit: 20, page: page, sort: '_id'};
    
    if(raspiv) {
        payload["raspiv"] = true;
    } else {
        payload["raspiv"] = 'undefined';
    }

    if(s) {
        payload["s"] = s;
    }

    const parfums = await ParfumService.getAll(payload);
    let fetchparfums = parfums.data.parfums;
    let parfumscount = parfums.data.count;

    return { props: { fetchparfums, parfumscount, page } }
}

export default AdminPage