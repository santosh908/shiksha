
export default function ShikshaProgram()
{
    return (
        <div className="max-w-12xl mx-auto py-8">
            <div
                className="rounded-2xl shadow-lg p-6 md:p-10 mb-8 border border-orange-200 flex flex-col items-center justify-center"
                style={{
                    backgroundImage: 'url(/pattern-nav.png)',
                    backgroundRepeat: 'repeat-x',
                    backgroundPosition: 'top',
                    backgroundColor: '#fff7ed',
                }}
            >
                <h1 className="text-3xl md:text-4xl font-bold text-orange-700 mb-4 text-center">Shiksha Program</h1>
                <p className="text-lg md:text-xl text-gray-700 mb-6 text-center">
                    Srila Prabhupada, out of his unlimited compassion, gave the world the most valuable gift – the process of Krishna consciousness, making the timeless wisdom of Bhagavad Gita and Srimad Bhagavatam accessible to all. His life was dedicated to spreading the message of Lord Krishna and ensuring that every soul could get the opportunity to reconnect with the Supreme.
                </p>
                <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-6 border border-orange-100">
                    <h2 className="text-xl md:text-2xl font-semibold text-orange-600 mb-2 text-center">A Living Tribute to Srila Prabhupada</h2>
                    <p className="text-gray-700 mb-2 text-center">
                        The Shiksha Program is one of the wonderful manifestations of Srila Prabhupada’s vision. It is not just an academic course but a systematic training program that nourishes both knowledge and practice. Through structured study of Bhagavad Gita, Srimad Bhagavatam, and Srila Prabhupada’s books, along with sadhana, seva, and spiritual association, devotees gradually develop a strong foundation in Krishna consciousness.
                    </p>
                    <p className="text-gray-700 mb-2 text-center">
                        This program reminds us that real education is not just about information but transformation of heart. By following the stages of <span className="font-semibold text-orange-700">Shraddhavan</span>, <span className="font-semibold text-orange-700">Krishna Sevak</span>, <span className="font-semibold text-orange-700">Krishna Sadhak</span>, <span className="font-semibold text-orange-700">Prabhupada Ashraya</span>, and <span className="font-semibold text-orange-700">Gurupada Ashraya</span>, we move step by step towards becoming more responsible, steady, and deeply connected servants of Sri Guru and Sri Krishna.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                    <div className="flex-1 bg-orange-50 rounded-xl p-4 shadow text-center">
                        <span className="text-2xl md:text-3xl">🌸</span>
                        <p className="mt-2 text-orange-700 font-medium">In essence, the Shiksha Program is a living tribute to Srila Prabhupada – a way for us to honor him by studying his books seriously, practicing his teachings sincerely, and sharing Krishna consciousness with others wholeheartedly.</p>
                    </div>
                    <div className="flex-1 bg-orange-50 rounded-xl p-4 shadow text-center">
                        <span className="text-2xl md:text-3xl">📖</span>
                        <p className="mt-2 text-orange-700 font-medium">By sincerely participating in the Shiksha Program, we not only strengthen our own bhakti but also serve Srila Prabhupada’s mission of spreading Krishna consciousness all over the world.</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-orange-100 text-center">
                    <blockquote className="italic text-orange-800 text-lg md:text-xl mb-2">“Your love for me will be shown by how you cooperate to keep this movement together.”</blockquote>
                    <span className="block text-gray-600">– Srila Prabhupada</span>
                </div>
            </div>
        </div>
    );
}