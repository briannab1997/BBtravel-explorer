import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Button from '@/components/ui/Button'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <PageLayout>
      <div className={styles.page}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>Looks like this destination doesn't exist on our map.</p>
        <Link to="/"><Button size="lg">Back to Home</Button></Link>
      </div>
    </PageLayout>
  )
}
