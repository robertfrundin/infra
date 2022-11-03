import fetch from "node-fetch";
import exec from "@actions/exec";

const { TAG, AUTHOR, TICKET_ID, AUTH_TOKEN, X_ORG_ID } = process.env;
const headers = {
    Authorization: `OAuth ${AUTH_TOKEN}`,
    'X-Org-ID': X_ORG_ID,
};

const main = async () => {
    const commits = await getCommits(TAG);
    const date = new Date().toLocaleDateString();
    const summary = `Релиз №${TAG.replace('rc-', '')} от ${date}`;
    const description = `Ответственный за релиз: ${AUTHOR}\n\nКоммиты, попавшие в релиз:\n${commits}`;

    await fetch(`https://api.tracker.yandex.net/v2/issues/${TICKET_ID}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
        summary,
        description,
    })
  });
};

const getCommits = async (currTag) => {
    try {
        const tags = (await execute('git', ['tag', '--list'])).split('\n')
            .filter(Boolean).sort((a, b) => {
                const aVer = parseInt(a.replace('rc-0.0.', ''), 10);
                const bVer = parseInt(b.replace('rc-0.0.', ''), 10);
                return aVer - bVer;
            });

            const index = tags.indexOf(currTag);
            const range = tags.length === 1 ? currTag : `${tags[index - 1]}...${currTag}`;

            const commits = await execute('git', ['log', '--pretty=format:"%H %an %s"', range]);
            return commits.replace(/"/g, '');
        } catch (e) {
            console.log('Ошибка при получении тикета')
        }   
};

const execute = async (command, options) => {
    let res = '';
    let err = '';

    await exec.exec(command, options, {
    listeners: {
        stdout: (data) => { res += data.toString(); },
        stderr: (data) => { err += data.toString(); }
    }
    });

    if (err) {
        throw new Error(`Error: ${err}`)
    }

    return res;
};

main().then(() => console.log('Ticket updated'));