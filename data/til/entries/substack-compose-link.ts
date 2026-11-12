import type { TILEntry } from "../index"

const _substack_compose_link: TILEntry = {
    id: "substack-compose-link",
    title: "Substack has a compose link, it just is not documented",
    date: "2026-11-12",
    category: "Web",
    published: true,
    body: "Bluesky, Mastodon and X each publish an address that opens their compose box with your text already in it. Substack does not. I wanted readers to be able to reply to a post from Substack, so I opened the site's own scripts in the browser's developer tools and searched them for the word \"compose\". The home page reads a few values from its address. Put `action=compose` and `message` together and the note composer opens with the text filled in.",
    detail: [
      {
        type: "code",
        lang: "text",
        code: `https://substack.com/home?action=compose&message=My%20thought%3A

  &restackUrl=https%3A%2F%2Fexample.com%2Fa-post       attaches that page as a link card
  &attachmentLink=https%3A%2F%2Fexample.com%2Fa.png    attaches that image
  &draftId=123456789                                   opens one of your own saved drafts`,
        caption: "Every value must be URL encoded",
      },
      {
        type: "note",
        text: "I tested all four values signed in. message fills the note. restackUrl attaches a card for the page it names, which can be a Substack post or any other web page. attachmentLink attaches an image and fails on anything that is not one. draftId opens a draft you saved earlier, using the number Substack gives that draft.",
      },
      {
        type: "note",
        text: "None of this is in Substack's documentation, so it can change without warning. I treat it as a convenience and keep the other networks beside it.",
      },
    ],
    tags: ["Substack", "web", "links"],
  }

export default _substack_compose_link
