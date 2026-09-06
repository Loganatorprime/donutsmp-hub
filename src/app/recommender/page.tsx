import { Card, CardContent } from '@/components/ui/card'
import { FarmQuiz } from './FarmQuiz'

export const metadata = {
  title: 'Farm Recommender',
  description:
    'Answer five questions and get the best DonutSMP money-making farms for your budget, playtime, and skill.',
}

export default function RecommenderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl tracking-wide">Farm Recommender</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Tell it how you play and it ranks all 20 money-making methods for your
        situation — budget, skill, dimension access, and goals.
      </p>
      <Card className="mt-8">
        <CardContent className="p-6">
          <FarmQuiz />
        </CardContent>
      </Card>
    </div>
  )
}
