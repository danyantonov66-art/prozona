const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

// Категории:
// "clients"   = За клиенти
// "specialists" = За майстори
// "prices"    = Цени по градове
// "seasonal"  = Сезонни съвети

const categories = [
  // За клиенти
  { id: 'cmn5u1kl50001la04s2ym3t0r', category: 'clients' },
  { id: 'cmn5udemd0003l504uealyc6i', category: 'clients' },
  { id: 'cmn5ug0yz0005l504d75u7djm', category: 'clients' },
  { id: 'cmn5uj3yr0007l50406z7980j', category: 'clients' },
  { id: 'cmn5vay2j000nl504xz4232l5', category: 'clients' },
  { id: 'cmn5ve1a3000pl504myx705wr', category: 'clients' },
  { id: 'cmn5vh4gc000rl504ukp3hh7x', category: 'clients' },
  { id: 'cmovc8rhc0003l204fs1g4riq', category: 'clients' },
  { id: 'cmpc9q30p0005u57wlyy7sihk', category: 'clients' },
  { id: 'cmpnstwn00001jv04qb5o8n97', category: 'clients' },
  { id: 'cmpnswfiw0003jv047c98hrkp', category: 'clients' },
  { id: 'cmpc9q3ok0007u57wf4dbvwtm', category: 'clients' },

  // За майстори
  { id: 'cmn5u6b320001l404negqwu6g', category: 'specialists' },
  { id: 'cmn5uaf4y0001l504gtho5hn9', category: 'specialists' },
  { id: 'cmn5umhu90009l504fj4uybmx', category: 'specialists' },
  { id: 'cmn5upkjd000bl504wb3tyr9o', category: 'specialists' },
  { id: 'cmn5utms4000dl504ziea3k9m', category: 'specialists' },
  { id: 'cmn5uzet7000fl504tqkaspvb', category: 'specialists' },
  { id: 'cmp2j34yt0001ky04iqxn063z', category: 'specialists' },
  { id: 'cmp2j4wbd0003ky047suuqxe9', category: 'specialists' },
  { id: 'cmp2j6lgn0005ky04o8j9rw8y', category: 'specialists' },
  { id: 'cmp2jmkh40001la04b89ypyyp', category: 'specialists' },
  { id: 'cmp2joner0003la048njablkh', category: 'specialists' },

  // Цени по градове
  { id: 'cmovc6y4j0001l204thhouy5z', category: 'prices' },
  { id: 'cmovcb8610005l204r3q5guyl', category: 'prices' },
  { id: 'cmovccuxb0007l204zi1kscqg', category: 'prices' },
  { id: 'cmovce8nt0009l2041q8a4j48', category: 'prices' },
  { id: 'cmovcfj80000bl204an8hnrqn', category: 'prices' },
  { id: 'cmovcjc53000fl2045b5p8w2b', category: 'prices' },
  { id: 'cmovcl0tv000kl204wgd2a1k5', category: 'prices' },
  { id: 'cmovcmgxq000ml204v73z8gz4', category: 'prices' },
  { id: 'cmoxu2usi0001l104hsjj3rx7', category: 'prices' },
  { id: 'cmoxu4ibh0003l1041aoydk68', category: 'prices' },
  { id: 'cmoxu6ivc0002jp04d651kywo', category: 'prices' },
  { id: 'cmoxu82j50004jp04am15igia', category: 'prices' },
  { id: 'cmozkgxjn0001ju046y3eqe1s', category: 'prices' },
  { id: 'cmozkilxc0003ju04je38p7x7', category: 'prices' },
  { id: 'cmozkk1r80005ju04y0fpsa4x', category: 'prices' },
  { id: 'cmozxtfy60001l204ew2gm3hk', category: 'prices' },
  { id: 'cmozxv7wp0003l204nws8q55h', category: 'prices' },
  { id: 'cmozxyjwq0001l504w2ejfum5', category: 'prices' },
  { id: 'cmozy2c6t0005l5049t63748j', category: 'prices' },
  { id: 'cmp2ff3xa0001la04xjw5axg3', category: 'prices' },
  { id: 'cmp2fhaoy0003la04tb8kwqcr', category: 'prices' },
  { id: 'cmp2fjc2s0005la04u7u229mb', category: 'prices' },
  { id: 'cmp2fli8m0007la04ipohlf9b', category: 'prices' },
  { id: 'cmp2fmxw80001jp04bqkgmz0r', category: 'prices' },
  { id: 'cmp2fohhw0003jp04qju7erff', category: 'prices' },
  { id: 'cmp2fq3dv0005jp04120r1c6a', category: 'prices' },
  { id: 'cmp2frkso0007jp04h8unkcnp', category: 'prices' },
  { id: 'cmp2ftda30009jp04beix8ew6', category: 'prices' },
  { id: 'cmp2fv90l000bjp04ockeq8ad', category: 'prices' },
  { id: 'cmpnsykrm0005jv04vsl8d1vg', category: 'prices' },
  { id: 'cmpnt0heq0007jv047zk7yvi1', category: 'prices' },

  // Сезонни съвети
  { id: 'cmn5v2425000hl504xxgqk58n', category: 'seasonal' },
  { id: 'cmn5v4xw3000jl504s31nsh76', category: 'seasonal' },
  { id: 'cmn5v7sp6000ll5043rfucppp', category: 'seasonal' },
  { id: 'cmozy088j0003l50425m2y2bp', category: 'seasonal' },
  { id: 'cmozy9pyb0007l504k4p5z2xb', category: 'seasonal' },
  { id: 'cmpgobm5q0001u59wmmlblfrk', category: 'seasonal' },
  { id: 'cmpgobmpk0005u59wo1cy2ti9', category: 'seasonal' },
  { id: 'cmpgobmx10007u59wxp46ek4x', category: 'seasonal' },
  { id: 'cmpgobn4h0009u59wrceelkfs', category: 'seasonal' },
  { id: 'cmpnt2c6v0009jv04sr2gge8l', category: 'seasonal' },
  { id: 'cmpgobmi30003u59wi9e1y6f8', category: 'seasonal' },
]

async function main() {
  let updated = 0
  for (const u of categories) {
    await p.blogPost.update({
      where: { id: u.id },
      data: { category: u.category }
    })
    updated++
    console.log(`✓ ${updated}/${categories.length} — ${u.category} — ${u.id}`)
  }
  console.log(`\nГотово! Категоризирани ${updated} статии.`)
  process.exit()
}

main().catch(e => { console.error(e); process.exit(1) })
