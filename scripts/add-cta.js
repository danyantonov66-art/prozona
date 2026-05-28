const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

const CTA = `
<div style="margin-top:2rem;padding:1.5rem;background:#1a1a2e;border:1px solid rgba(29,185,84,0.3);border-radius:12px;">
  <h3 style="color:#1DB954;margin-bottom:0.5rem;">Намери надежден специалист безплатно</h3>
  <p style="color:#9ca3af;margin-bottom:1rem;">Публикувай запитване за 60 секунди и получи оферти от верифицирани майстори в твоя град.</p>
  <a href="https://prozona.bg/bg/search" style="display:inline-block;background:#1DB954;color:#000;padding:0.75rem 1.5rem;border-radius:8px;font-weight:600;text-decoration:none;">→ Публикувай безплатно запитване</a>
</div>`

// Само старите статии — без новите 5 от 27.05 и без тези които вече имат CTA
const oldPostIds = [
  'cmn5u1kl50001la04s2ym3t0r',
  'cmn5u6b320001l404negqwu6g',
  'cmn5uaf4y0001l504gtho5hn9',
  'cmn5udemd0003l504uealyc6i',
  'cmn5ug0yz0005l504d75u7djm',
  'cmn5uj3yr0007l50406z7980j',
  'cmn5umhu90009l504fj4uybmx',
  'cmn5upkjd000bl504wb3tyr9o',
  'cmn5utms4000dl504ziea3k9m',
  'cmn5uzet7000fl504tqkaspvb',
  'cmn5v2425000hl504xxgqk58n',
  'cmn5v4xw3000jl504s31nsh76',
  'cmn5v7sp6000ll5043rfucppp',
  'cmn5vay2j000nl504xz4232l5',
  'cmn5ve1a3000pl504myx705wr',
  'cmn5vh4gc000rl504ukp3hh7x',
  'cmovc6y4j0001l204thhouy5z',
  'cmovc8rhc0003l204fs1g4riq',
  'cmovcb8610005l204r3q5guyl',
  'cmovccuxb0007l204zi1kscqg',
  'cmovce8nt0009l2041q8a4j48',
  'cmovcfj80000bl204an8hnrqn',
  'cmovcjc53000fl2045b5p8w2b',
  'cmovcl0tv000kl204wgd2a1k5',
  'cmovcmgxq000ml204v73z8gz4',
  'cmoxu2usi0001l104hsjj3rx7',
  'cmoxu4ibh0003l1041aoydk68',
  'cmoxu6ivc0002jp04d651kywo',
  'cmoxu82j50004jp04am15igia',
  'cmozkgxjn0001ju046y3eqe1s',
  'cmozkilxc0003ju04je38p7x7',
  'cmozkk1r80005ju04y0fpsa4x',
  'cmozxtfy60001l204ew2gm3hk',
  'cmozxv7wp0003l204nws8q55h',
  'cmozxyjwq0001l504w2ejfum5',
  'cmozy088j0003l50425m2y2bp',
  'cmozy2c6t0005l5049t63748j',
  'cmozy9pyb0007l504k4p5z2xb',
  'cmp2ff3xa0001la04xjw5axg3',
  'cmp2fhaoy0003la04tb8kwqcr',
  'cmp2fjc2s0005la04u7u229mb',
  'cmp2fli8m0007la04ipohlf9b',
  'cmp2fmxw80001jp04bqkgmz0r',
  'cmp2fohhw0003jp04qju7erff',
  'cmp2fq3dv0005jp04120r1c6a',
  'cmp2frkso0007jp04h8unkcnp',
  'cmp2ftda30009jp04beix8ew6',
  'cmp2fv90l000bjp04ockeq8ad',
  'cmp2j34yt0001ky04iqxn063z',
  'cmp2j4wbd0003ky047suuqxe9',
  'cmp2j6lgn0005ky04o8j9rw8y',
  'cmp2jmkh40001la04b89ypyyp',
  'cmp2joner0003la048njablkh',
  'cmpc9q30p0005u57wlyy7sihk',
  'cmpc9q3ok0007u57wf4dbvwtm',
  'cmpgobm5q0001u59wmmlblfrk',
  'cmpgobmi30003u59wi9e1y6f8',
  'cmpgobmpk0005u59wo1cy2ti9',
  'cmpgobmx10007u59wxp46ek4x',
  'cmpgobn4h0009u59wrceelkfs',
]

async function main() {
  let updated = 0
  for (const id of oldPostIds) {
    const post = await p.blogPost.findUnique({ where: { id }, select: { content: true } })
    if (!post) { console.log(`Не е намерена: ${id}`); continue }
    
    // Пропусни ако вече има CTA
    if (post.content.includes('Публикувай безплатно запитване')) {
      console.log(`⏭ Вече има CTA: ${id}`)
      continue
    }

    await p.blogPost.update({
      where: { id },
      data: { content: post.content + CTA }
    })
    updated++
    console.log(`✓ ${updated} — ${id}`)
  }
  console.log(`\nГотово! Обновени ${updated} статии.`)
  process.exit()
}

main().catch(e => { console.error(e); process.exit(1) })
